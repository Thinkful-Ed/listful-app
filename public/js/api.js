'use strict';

class Api {

  constructor(path, baseUrl = window.location.origin) {
    this.baseUrl = baseUrl;
    this.path = path;
  }

  _buildUrl(path, query = {}) {
    var url = new URL(path, this.baseUrl);

    const queryKeys = Object.keys(query);
    queryKeys.forEach(key => url.searchParams.set(key, query[key]));

    return url;
  }

  async _handleErrors(res) {
    const err = await res.json();
    return Promise.reject(err);
  }

  async _readResponse(res) {
    if (res.status === 204) {
      return await res.text();
    }
    return await res.json();
  }

  async create(document) {
    const url = this._buildUrl(this.path);

    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: document ? JSON.stringify(document) : null
    });
    if (!res.ok) {
      return this._handleErrors(res);
    }
    return this._readResponse(res);
  }

  async search(query) {
    const url = this._buildUrl(this.path, query);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      return this._handleErrors(res);
    }
    return this._readResponse(res);
  }

  async details(id) {
    const url = this._buildUrl(`${this.path}/${id}`);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      return this._handleErrors(res);
    }
    return this._readResponse(res);
  }

  async replace(id, obj) {
    const url = this._buildUrl(`${this.path}/${id}`);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: obj ? JSON.stringify(obj) : null
    });
    if (!res.ok) {
      return this._handleErrors(res);
    }
    return this._readResponse(res);
  }

  async update(id, obj) {
    const url = this._buildUrl(`${this.path}/${id}`);

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: obj ? JSON.stringify(obj) : null
    });
    if (!res.ok) {
      return this._handleErrors(res);
    }
    return this._readResponse(res);
  }

  async remove(id) {
    const url = this._buildUrl(`${this.path}/${id}`);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      return this._handleErrors(res);
    }
    return this._readResponse(res);
  }

}
