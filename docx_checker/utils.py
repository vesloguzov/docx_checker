#-*- coding: utf-8 -*-
import os
import pkg_resources

from django.template import Context, Template
from django.utils.encoding import smart_text


def load_resource(resource_path):
        """
        Gets the content of a resource
        """
        try:
            resource_content = pkg_resources.resource_string(__name__, resource_path)
            return smart_text(resource_content)
        except EnvironmentError:
            pass


def load_resources(js_urls, css_urls, fragment):
    """
    Загрузка локальных статических ресурсов.
    """
    for js_url in js_urls:

        if js_url.startswith('public/'):
            fragment.add_javascript_url(self.runtime.local_resource_url(self, js_url))
        elif js_url.startswith('static/'):
            fragment.add_javascript(load_resource(js_url))
        else:
            pass

    for css_url in css_urls:

        if css_url.startswith('public/'):
            fragment.add_css_url(self.runtime.local_resource_url(self, css_url))
        elif css_url.startswith('static/'):
            fragment.add_css(load_resource(css_url))
        else:
            pass

def render_template(template_path, context=None):
    """
    Evaluate a template by resource path, applying the provided context.
    """
    if context is None:
        context = {}

    template_str = load_resource(template_path)
    template = Template(template_str)
    return template.render(Context(context))