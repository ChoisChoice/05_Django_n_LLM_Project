from django.conf import settings


def pagination(request):

    """ 페이지네이션을 정의하는 함수 """

    try:
        page = request.query_params.get("page", 1)
        page = int(page)
    except ValueError:
        page = 1
    page_size = settings.PAGE_SIZE
    start = (page - 1) * page_size 
    end = start + page_size
    return start, end
