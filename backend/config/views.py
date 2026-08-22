from pathlib import Path

from django.conf import settings
from django.http import HttpResponse


def spa(request, path=""):
    index_path = Path(settings.STATICFILES_DIRS[0]) / "index.html"
    if not index_path.exists():
        return HttpResponse("Chưa build frontend. Chạy 'npm run build' trong thư mục frontend.", status=404)
    return HttpResponse(index_path.read_bytes(), content_type="text/html")