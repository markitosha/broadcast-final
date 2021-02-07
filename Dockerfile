FROM python:3.9.1-slim-buster

ENV POETRY_VERSION=1.1.4 \
    POETRY_VIRTUALENVS_CREATE=false \
    PYTHONUNBUFFERED=1

WORKDIR /code

COPY ./back/poetry.lock ./back/pyproject.toml /code/
RUN pip install "poetry==$POETRY_VERSION" && poetry install --no-interaction --no-ansi

COPY ./back/ /code/
WORKDIR /code
