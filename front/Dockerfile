FROM node:12

ENV REACT_APP_API=https://bcs-nutcracker.ru:8443 \
    REACT_APP_SOCKET=wss://bcs-nutcracker.ru:8443
#    REACT_APP_API=https://broadcast.rakhmatull.in:8443 \
#    REACT_APP_SOCKET=wss://broadcast.rakhmatull.in:8443


RUN yarn global add serve

RUN mkdir /code
WORKDIR /code
COPY ./front/ /code/

RUN npm install
RUN npm run build
