# -*- coding: utf-8 -*-

import pkg_resources


import hashlib
import logging
import mimetypes
import os
import uuid

from docx import Document

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment
from django.core.files import File
from django.core.files.storage import default_storage
from django.core.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt

from student.models import user_by_anonymous_id
from submissions import api as submissions_api
from submissions.models import StudentItem as SubmissionsStudent

from functools import partial
from xmodule.util.duedate import get_extended_due_date
from webob.response import Response


from .utils import (
    load_resource,
    render_template,
    load_resources,
    )


from analyze import *


log = logging.getLogger(__name__)
BLOCK_SIZE = 8 * 1024

class DocxCheckerXBlock(XBlock):

    correct_docx_uid = String(
         default='', scope=Scope.settings,
         help='Correct file from teacher',
        )
    correct_docx_name = String(
         default='', scope=Scope.settings,
         help='Name of correct file from teacher',
        )
    
    source_docx_uid = String(
         default='', scope=Scope.settings,
         help='Unformatted file for student',
        )

    source_docx_name = String(
         default='', scope=Scope.settings,
         help='Name of unformatted file for student',
        )

    student_docx_uid = String(
         default='', scope=Scope.user_state,
         help='Studen file from student',
        )
    student_docx_name = String(
         default='', scope=Scope.user_state,
         help='Name of student file from student',
        )


    correct_docx_object = String(
         default='', scope=Scope.settings,
         help='Correct file from teacher',
        )


    display_name = String(
        display_name=u"Название",
        help=u"Название задания, которое увидят студенты.",
        default=u'Проверка стилевого оформления',
        scope=Scope.settings
    )

    question = String(
        # TODO: list
        display_name=u"Вопрос",
        help=u"Текст задания.",
        default=u"<h3>Лабораторная работа включает в себя следующие элементы:</h3><ol><li>Работа со стилями. Создание стиля для основного текста и для заголовков.</li><li>Оформление документа (установка полей, нумерации страниц, разрывов страниц, заполнение верхнего колонтитула).</li><li>Создание сноски.</li><li>Создание предметного указателя.</li><li>Создание оглавления.</li><li>Оформление титульного листа.</li>",
        scope=Scope.settings
    )

    weight = Integer(
        display_name=u"Максимальное количество баллов",
        help=(u"Максимальное количество баллов",
              u"которое может получить студент."),
        default=10,
        scope=Scope.settings
    )

    #TODO: 1!
    max_attempts = Integer(
        display_name=u"Максимальное количество попыток",
        help=u"",
        default=10,
        scope=Scope.settings
    )
    
    attempts = Integer(
        display_name=u"Количество использованных попыток",
        help=u"",
        default=0,
        scope=Scope.user_state
    )

    points = Integer(
        display_name=u"Текущее количество баллов студента",
        default=None,
        scope=Scope.user_state
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        context = {
            "display_name": self.display_name,
            "weight": self.weight,
            "question": self.question,
            "student_docx_name": self.student_docx_name,
            "points": self.points,
            "attempts": self.attempts,
        }

        if self.max_attempts != 0:
            context["max_attempts"] = self.max_attempts

        if self.past_due():
            context["past_due"] = True

        if answer_opportunity(self):
            context["answer_opportunity"] = True

        fragment = Fragment()
        fragment.add_content(
            render_template(
                "static/html/docx_checker.html",
                context
            )
        )

        js_urls = (
            "static/js/src/docx_checker.js",
            )

        css_urls = (
            "static/css/docx_checker.css",
            )

        load_resources(js_urls, css_urls, fragment)

        fragment.initialize_js('DocxCheckerXBlock')
        return fragment

    def studio_view(self, context=None):
        context = {
            "display_name": self.display_name,
            "weight": self.weight,
            "question": self.question,
            "max_attempts": self.max_attempts,
        }
        fragment = Fragment()
        fragment.add_content(
            render_template(
                "static/html/docx_checker_studio.html",
                context
            )
        )

        js_urls = (
            "static/js/src/docx_checker_studio.js",
            )

        css_urls = (
            "static/css/docx_checker_studio.css",
            )

        load_resources(js_urls, css_urls, fragment)

        fragment.initialize_js('DocxCheckerXBlockEdit')
        return fragment

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("DocxCheckerXBlock",
             """<docx_checker/>
             """),
            ("Multiple DocxCheckerXBlock",
             """<vertical_demo>
                <docx_checker/>
                <docx_checker/>
                <docx_checker/>
                </vertical_demo>
             """),
        ]



    @XBlock.json_handler
    def student_submit(self, data, suffix=''):

        def check_answer():
            return 55

        grade_global = check_answer()
        self.points = grade_global
        self.points = grade_global * self.weight / 100
        self.points = int(round(self.points))
        self.attempts += 1
        self.runtime.publish(self, 'grade', {
            'value': self.points,
            'max_value': self.weight,
        })
        res = {"success_status": 'ok', "points": self.points, "weight": self.weight, "attempts": self.attempts, "max_attempts": self.max_attempts}
        return res

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        self.display_name = data.get('display_name')
        self.question = data.get('question')
        self.weight = data.get('weight')
        self.max_attempts = data.get('max_attempts')

        return {'result': 'success'}

    @XBlock.handler
    def download_assignment(self, request, suffix=''):
        path = self._file_storage_path(self.source_docx_uid, self.source_docx_name)
        return self.download(
            path,
            mimetypes.guess_type(self.source_docx_name)[0],
            self.source_docx_name
        )

    @XBlock.handler
    def download_student_file(self, request, suffix=''):
        path = self._students_storage_path(self.student_docx_uid, self.student_docx_name)
        return self.download(
            path,
            mimetypes.guess_type(self.source_docx_name)[0],
            self.student_docx_name
        )


    def is_course_staff(self):
        # pylint: disable=no-member
        """
         Check if user is course staff.
        """
        return getattr(self.xmodule_runtime, 'user_is_staff', False)

    @XBlock.handler
    def student_filename(self, request, suffix=''):
        return Response(json_body={'student_filename': self.student_docx_name})

    @XBlock.handler
    def upload_student_file(self, request, suffix=''):
        upload = request.params['studentFile']
        self.student_docx_name = upload.file.name
        self.student_docx_uid = uuid.uuid4().hex
        path = self._students_storage_path(self.student_docx_uid, self.student_docx_name)
        if not default_storage.exists(path):
            default_storage.save(path, File(upload.file))
        obj = get_analyze_the_document(path)
        return Response(json_body=obj)

    @XBlock.handler
    def upload_correct_file(self, request, suffix=''):
        upload = request.params['correctFile']
        self.correct_docx_name = upload.file.name
        self.correct_docx_uid = uuid.uuid4().hex
        path = self._file_storage_path(self.correct_docx_uid, self.source_docx_name)
        if not default_storage.exists(path):
            default_storage.save(path, File(upload.file))
        obj = get_analyze_the_document(path)
        return Response(json_body=obj)


    @XBlock.handler
    def upload_source_file(self, request, suffix=''):
        upload = request.params['sourceFile']
        self.source_docx_name = upload.file.name
        self.source_docx_uid = uuid.uuid4().hex
        path = self._file_storage_path(self.source_docx_uid, self.source_docx_name)
        if not default_storage.exists(path):
            default_storage.save(path, File(upload.file))
        return Response(json_body=str(self.source_docx_uid))

    def _file_storage_path(self, uid, filename):
        # pylint: disable=no-member
        """
        Get file path of storage.
        """
        path = (
            '{loc.org}/{loc.course}/{loc.block_type}'
            '/{uid}{ext}'.format(
                loc=self.location,
                uid= uid,
                ext=os.path.splitext(filename)[1]
            )
        )
        return path

    def _students_storage_path(self, uid, filename):
        # pylint: disable=no-member
        """
        Get file path of storage.
        """
        path = (
            '{loc.org}/{loc.course}/{loc.block_type}/students'
            '/{uid}{ext}'.format(
                loc=self.location,
                uid=uid,
                ext=os.path.splitext(filename)[1]
            )
        )
        return path

    def download(self, path, mime_type, filename, require_staff=False):
        """
        Return a file from storage and return in a Response.
        """
        try:
            file_descriptor = default_storage.open(path)
            app_iter = iter(partial(file_descriptor.read, BLOCK_SIZE), '')
            return Response(
                app_iter=app_iter,
                content_type=mime_type,
                content_disposition="attachment; filename=" + filename.encode('utf-8'))
        except IOError:
            if require_staff:
                return Response(
                    "Sorry, assignment {} cannot be found at"
                    " {}. Please contact {}".format(
                        filename.encode('utf-8'), path, settings.TECH_SUPPORT_EMAIL
                    ),
                    status_code=404
                )
            return Response(
                "Sorry, the file you uploaded, {}, cannot be"
                " found. Please try uploading it again or contact"
                " course staff".format(filename.encode('utf-8')),
                status_code=404
            )

    def past_due(self):
            """
            Проверка, истекла ли дата для выполнения задания.
            """
            due = get_extended_due_date(self)
            if due is not None:
                if _now() > due:
                    return False
            return True

    def is_course_staff(self):
        """
        Проверка, является ли пользователь автором курса.
        """
        return getattr(self.xmodule_runtime, 'user_is_staff', False)

    def is_instructor(self):
        """
        Проверка, является ли пользователь инструктором.
        """
        return self.xmodule_runtime.get_user_role() == 'instructor'

def _now():
    """
    Получение текущих даты и времени.
    """
    return datetime.datetime.utcnow().replace(tzinfo=pytz.utc)

def answer_opportunity(self):
    """
    Возможность ответа (если количество сделанных попыток меньше заданного).
    """
    if self.max_attempts <= self.attempts and self.max_attempts != 0:
        return False
    else:
        return True

def require(assertion):
    """
    Raises PermissionDenied if assertion is not true.
    """
    if not assertion:
        raise PermissionDenied

