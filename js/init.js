'use strict';

var zoom = {

    channelUrl: 'https://ws.zooom.no/v1/channels',
    articleUrl: 'https://ws.zooom.no/v1/articles/channelName?limit=10&amp;offset=0',
    month: "",

    getChannel: function () {

        var that = this;

        $.getJSON(that.channelUrl, function (data) {
            var channels = data.items;
            that.buildMenus(channels);
        })
            .fail(function () {
                console.log("Channel data failed to load");
            });
    },

    getArticle: function (channelName) {
        var that = this,
            currentArticleURL = that.articleUrl.replace('channelName', channelName);
        $.getJSON(currentArticleURL, function (data) {
            console.log(data);
            var articles = data.items;
            that.buildArticles(channelName, articles);
            $('.article-block:first').show();
        })
            .fail(function () {
                console.log("Article data failed to load");
            });
    },


    buildMenus: function (channels) {
        var that = this;

        $.each(channels, function (key, value) {
            var name = value.channel.name,
                urlSafeName = value.channel.urlSafeName,
                image = value.cover_image,
                menuItem = $('<div class="column small-12 medium-4 large-4 menu-item hide-for-small-only"></div>'),
                mobileMenuItem = $('<div class="column small-12 mobile-menu-item show-for-small-only"></div>');
            menuItem.attr('style', 'background-image: url(' + image + ')');
            menuItem.attr('urlSafeName', urlSafeName);
            mobileMenuItem.attr('urlSafeName', urlSafeName);
            mobileMenuItem.append('<span class="headline">' + name + '</span>');
            menuItem.append('<span class="headline hide-for-small-only">' + name + '</span>');
            menuItem.append('<div class="bottom-bar hide-for-small-only"></div>');
            $('#menuHeader').append(menuItem);
            $('#mobileMenu').append(mobileMenuItem);
            that.getArticle(urlSafeName);
        });
        $('.menu-item:first').addClass('active');
        $('.mobile-menu-item:first').addClass('active');
        $('.menu-item').on('click', function () {
            that.selectChannel($(this).attr('urlsafename'));
        });

        $('.mobile-menu').on('click', '.mobile-menu-item', function () {
            var parent = $(this).parent();
            if (!$(this).hasClass('active')) {
                parent.addClass('closed');
                parent.removeClass('open');
                that.selectChannel($(this).attr('urlSafeName'));
                return;
            }
            if (parent.hasClass('open')) {
                parent.addClass('closed');
                parent.removeClass('open');
            }
            else {
                parent.addClass('open');
                parent.removeClass('closed');
            }

        });

    },


    buildArticles: function (urlSafeName, articles) {
        var that = this,
            articleBlock = $('<div class="row timeline article-block">' +
                '<div class="line"></div>' +
                '</div>');

        $.each(articles, function (key, value) {
            var title = value.contents.title,
                intro = value.contents.preamble,
                $intro = $(intro),
                image = value.cover_image,
                day = moment(value.meta.created).format('DD'),
                month = moment(value.meta.created).format('MMM'),
                article = $('<div class="timeline-article arrow-box"></div>');

            console.log(value.channel.urlSafeName, urlSafeName);

            if (value.channel.urlSafeName === urlSafeName) {

                if (day === that.day && month === that.month) {
                    article.append('<div class="dot"></div>');
                } else {
                    article.append('<div class="time-stamp"><div class="day">' + day + '</div><div class="month">' + month + '</div></div>');
                }

                that.day = day;
                that.month = month;

                article.append('<img class="video-preview" src="' + image + '"/>');
                article.append('<span class="title">' + title + '</span>');
                $intro.append(' ... <a href="#">Les mer</a>');
                article.append($intro);
                articleBlock.append(article);
            }
        });

        articleBlock.addClass(urlSafeName + '-article-block');
        $(articleBlock).append('<div class="row footer" id="footer">' +
            '<div class="dashed-line"></div>' +
            '</div>');

        $('.timelines-block').append(articleBlock);

    },

    selectChannel: function (channelName) {
        $('.article-block').fadeOut(100);
        $('.' + channelName + '-article-block').fadeIn(100);
        $('.active').removeClass('active');
        $('.menu-item[urlsafename=' + channelName + ']').addClass('active');
        $('.mobile-menu-item').removeClass('active');
        var mobileMenuItem = $('.mobile-menu-item[urlsafename=' + channelName + ']');
        console.log(mobileMenuItem);
        $('.mobile-menu-item[urlsafename=' + channelName + ']').remove();
        mobileMenuItem.addClass('active');
        $('.mobile-menu').prepend(mobileMenuItem);
    }

};

$(function () {
    zoom.getChannel();

});




