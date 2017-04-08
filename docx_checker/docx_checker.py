"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment
from django.core.files import File
from django.core.files.storage import default_storage

from webob.response import Response

from .utils import (
    load_resource,
    render_template,
    load_resources,
    )


class DocxCheckerXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )
    correct_docx = String(
         default='', scope=Scope.settings,
         help='Correct file from teacher',
        )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the DocxCheckerXBlock, shown to students
        when viewing courses.
        """
        context = {"count": self.count}
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
        """
        The primary view of the DocxCheckerXBlock, shown to students
        when viewing courses.
        """
        context = {"count": self.count}
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

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def increment_count(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        assert data['hello'] == 'world'

        self.count += 1
        return {"count": self.count}

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


    @XBlock.handler
    def upload_correct_file(self, request, suffix=''):
        # pylint: disable=unused-argument
        """
        Save a students submission file.
        """
        upload = request.params['filename']
        print(upload, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

        

        # path = self._file_storage_path(upload.file.name)
        # if not default_storage.exists(path):
        #     default_storage.save(path, File(upload.file))
        return Response(json_body=request.params.keys())


    def _file_storage_path(self, filename):
        path = (
            '{loc.org}/{loc.course}/{loc.block_type}/{loc.block_id}'
            '/{sha1}{ext}'.format(
                loc=self.location,
                ext=os.path.splitext(filename)[1]
            )
        )
        return path