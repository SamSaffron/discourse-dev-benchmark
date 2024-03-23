# frozen_string_literal: true

module PageObjects
  module Pages
    class Topic < PageObjects::Pages::Base
      def initialize
        @composer_component = PageObjects::Components::Composer.new
        @fast_edit_component = PageObjects::Components::FastEditor.new
        @topic_map_component = PageObjects::Components::TopicMap.new
        @private_message_map_component = PageObjects::Components::PrivateMessageMap.new
      end

      def visit_topic(topic, post_number: nil)
        url = "/t/#{topic.id}"
        url += "/#{post_number}" if post_number
        page.visit(url)
        self
      end

      def open_new_topic
        page.visit "/new-topic"
        self
      end

      def open_new_message
        page.visit "/new-message"
        self
      end

      def visit_topic_and_open_composer(topic)
        visit_topic(topic)
        click_reply_button
        self
      end

      def current_topic_id
        find("h1[data-topic-id]")["data-topic-id"]
      end

      def current_topic
        ::Topic.find(current_topic_id)
      end

      def has_topic_title?(text)
        has_css?("h1 .fancy-title", text: text)
      end

      def has_post_content?(post)
        post_by_number(post).has_content? post.raw
      end

      def has_post_number?(number)
        has_css?("#post_#{number}")
      end

      def post_by_number(post_or_number, wait: Capybara.default_max_wait_time)
        post_or_number = post_or_number.is_a?(Post) ? post_or_number.post_number : post_or_number
        find(".topic-post:not(.staged) #post_#{post_or_number}", wait: wait)
      end

      def post_by_number_selector(post_number)
        ".topic-post:not(.staged) #post_#{post_number}"
      end

      def has_post_more_actions?(post)
        within post_by_number(post) do
          has_css?(".show-more-actions")
        end
      end

      def has_post_bookmarked?(post)
        is_post_bookmarked(post, bookmarked: true)
      end

      def has_no_post_bookmarked?(post)
        is_post_bookmarked(post, bookmarked: false)
      end

      def expand_post_actions(post)
        post_by_number(post).find(".show-more-actions").click
      end

      def click_post_action_button(post, button)
        case button
        when :bookmark
          post_by_number(post).find(".bookmark.with-reminder").click
        when :reply
          post_by_number(post).find(".post-controls .reply").click
        when :flag
          post_by_number(post).find(".post-controls .create-flag").click
        when :copy_link
          post_by_number(post).find(".post-controls .post-action-menu__copy-link").click
        end
      end

      def expand_post_admin_actions(post)
        post_by_number(post).find(".show-post-admin-menu").click
      end

      def click_post_admin_action_button(post, button)
        element_klass = "[data-content][data-identifier='admin-post-menu']"
        case button
        when :grant_badge
          element_klass += " .grant-badge"
        when :change_owner
          element_klass += " .change-owner"
        end

        find(element_klass).click
      end

      def click_topic_footer_button(button)
        find_topic_footer_button(button).click
      end

      def has_topic_bookmarked?
        has_css?("#{topic_footer_button_id("bookmark")}.bookmarked", text: "Edit Bookmark")
      end

      def has_no_bookmarks?
        has_no_css?("#{topic_footer_button_id("bookmark")}.bookmarked")
      end

      def find_topic_footer_button(button)
        find(topic_footer_button_id(button))
      end

      def click_reply_button
        find(".topic-footer-main-buttons > .create").click
        has_expanded_composer?
      end

      def has_expanded_composer?
        has_css?("#reply-control.open")
      end

      def type_in_composer(input)
        @composer_component.type_content(input)
      end

      def fill_in_composer(input)
        @composer_component.fill_content(input)
      end

      def clear_composer
        @composer_component.clear_content
      end

      def has_composer_content?(content)
        @composer_component.has_content?(content)
      end

      def has_composer_popup_content?(content)
        @composer_component.has_popup_content?(content)
      end

      def send_reply(content = nil)
        fill_in_composer(content) if content
        find("#reply-control .save-or-cancel .create").click
      end

      def fill_in_composer_title(title)
        @composer_component.fill_title(title)
      end

      def fast_edit_button
        find(".quote-button .quote-edit-label")
      end

      def click_fast_edit_button
        find(".quote-button .quote-edit-label").click
      end

      def fast_edit_input
        @fast_edit_component.fast_edit_input
      end

      def copy_quote_button_selector
        ".quote-button .copy-quote"
      end

      def copy_quote_button
        find(copy_quote_button_selector)
      end

      def click_mention(post, mention)
        within post_by_number(post) do
          find("a.mention-group", text: mention).click
        end
      end

      def click_footer_reply
        find("#topic-footer-buttons .btn-primary", text: "Reply").click
        self
      end

      def click_like_reaction_for(post)
        post_by_number(post).find(".post-controls .actions .like").click
      end

      def has_topic_map?
        @topic_map_component.is_visible?
      end

      def has_no_topic_map?
        @topic_map_component.is_not_visible?
      end

      def has_private_message_map?
        @private_message_map_component.is_visible?
      end

      def click_notifications_button
        find(".topic-notifications-button .select-kit-header").click
      end

      def click_admin_menu_button
        find("#topic-footer-buttons .topic-admin-menu-button").click
      end

      def watch_topic
        click_notifications_button
        find('li[data-name="watching"]').click
      end

      def close_topic
        click_admin_menu_button
        find(".topic-admin-popup-menu ul.topic-admin-menu-topic li.topic-admin-close").click
      end

      def has_read_post?(post)
        post_by_number(post).has_css?(".read-state.read", visible: :all, wait: 3)
      end

      private

      def topic_footer_button_id(button)
        "#topic-footer-button-#{button}"
      end

      def is_post_bookmarked(post, bookmarked:)
        within post_by_number(post) do
          page.public_send(
            bookmarked ? :has_css? : :has_no_css?,
            ".bookmark.with-reminder.bookmarked",
          )
        end
      end
    end
  end
end
