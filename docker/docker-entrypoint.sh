#!/bin/sh
set -eu

envsubst '${PORT}' < /templates/default.conf.template > /etc/nginx/conf.d/default.conf
envsubst '${API_BASE_URL} ${LEGACY_APP_ORIGIN} ${LEGACY_LOGOUT_URL}' < /templates/env.js.template > /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'
