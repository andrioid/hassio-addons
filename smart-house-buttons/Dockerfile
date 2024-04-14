ARG BUILD_FROM=ghcr.io/hassio-addons/ubuntu-base:9.0.5
FROM $BUILD_FROM

ENV LANG C.UTF-8
RUN apt-get update
RUN apt-get install -y curl unzip
RUN curl -fsSL https://bun.sh/install | bash && cp /root/.bun/bin/* /usr/local/bin


RUN mkdir /app && useradd -m app && chown app /app
WORKDIR /app
#USER app


ADD package.json /app/

RUN bun install
COPY --chown=app . .

CMD [ "./run.sh"]

LABEL \
  io.hass.version="VERSION" \
  io.hass.type="addon" \
  io.hass.arch="armhf|aarch64|i386|amd64"