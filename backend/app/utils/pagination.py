from flask import request, jsonify

def paginate(query, page, per_page):
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return {
        'total': total,
        'page': page,
        'per_page': per_page,
        'items': items
    }

def paginate_response(query, page, per_page):
    pagination = paginate(query, page, per_page)
    return jsonify({
        'total': pagination['total'],
        'page': pagination['page'],
        'per_page': pagination['per_page'],
        'items': [item.to_dict() for item in pagination['items']]
    })