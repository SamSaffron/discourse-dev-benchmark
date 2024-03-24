FROM discourse/base:2.0.20231218-0429

ADD . /bench

RUN chown -R discourse /bench
RUN cd /bench &&\
    sudo -u discourse bundle config --local deployment true &&\
    sudo -u discourse bundle config --local path ./vendor/bundle &&\
    sudo -u discourse bundle install &&\
    sudo -u discourse yarn install --frozen-lockfile &&\
    sudo -u discourse yarn cache clean

RUN gem install facter

WORKDIR /bench
ENTRYPOINT ["sudo", "-u", "discourse", "./bench"]

# docker build -t discourse-dev-bench . && docker run --rm discourse-dev-bench

