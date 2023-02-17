FROM rcc-image
COPY ./ /src

EXPOSE 5000

WORKDIR /src
CMD [ "node", "app.js" ]
