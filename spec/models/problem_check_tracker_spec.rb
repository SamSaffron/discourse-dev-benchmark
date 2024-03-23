# frozen_string_literal: true

RSpec.describe ProblemCheckTracker do
  describe "validations" do
    let(:record) { described_class.new(identifier: "twitter_login") }

    it { expect(record).to validate_presence_of(:identifier) }
    it { expect(record).to validate_uniqueness_of(:identifier) }

    it { expect(record).to validate_numericality_of(:blips).is_greater_than_or_equal_to(0) }
  end

  describe ".[]" do
    before { Fabricate(:problem_check_tracker, identifier: "twitter_login") }

    context "when the problem check tracker already exists" do
      it { expect(described_class[:twitter_login]).not_to be_new_record }
    end

    context "when the problem check tracker doesn't exist yet" do
      it { expect(described_class[:facebook_login]).to be_previously_new_record }
    end
  end

  describe "#ready_to_run?" do
    let(:problem_tracker) { described_class.new(next_run_at:) }

    context "when the next run timestamp is not set" do
      let(:next_run_at) { nil }

      it { expect(problem_tracker).to be_ready_to_run }
    end

    context "when the next run timestamp is in the past" do
      let(:next_run_at) { 5.minutes.ago }

      it { expect(problem_tracker).to be_ready_to_run }
    end

    context "when the next run timestamp is in the future" do
      let(:next_run_at) { 5.minutes.from_now }

      it { expect(problem_tracker).not_to be_ready_to_run }
    end
  end

  describe "#problem!" do
    let(:problem_tracker) do
      Fabricate(:problem_check_tracker, identifier: "twitter_login", **original_attributes)
    end

    let(:original_attributes) do
      {
        blips: 0,
        last_problem_at: 1.week.ago,
        last_success_at: 24.hours.ago,
        last_run_at: 24.hours.ago,
        next_run_at: nil,
      }
    end

    let(:updated_attributes) { { blips: 1 } }

    it do
      freeze_time

      expect { problem_tracker.problem!(next_run_at: 24.hours.from_now) }.to change {
        problem_tracker.attributes
      }.to(hash_including(updated_attributes))
    end
  end

  describe "#no_problem!" do
    let(:problem_tracker) do
      Fabricate(:problem_check_tracker, identifier: "twitter_login", **original_attributes)
    end

    let(:original_attributes) do
      {
        blips: 0,
        last_problem_at: 1.week.ago,
        last_success_at: Time.current,
        last_run_at: 24.hours.ago,
        next_run_at: nil,
      }
    end

    let(:updated_attributes) { { blips: 0 } }

    it do
      freeze_time

      expect { problem_tracker.no_problem!(next_run_at: 24.hours.from_now) }.to change {
        problem_tracker.attributes
      }.to(hash_including(updated_attributes))
    end
  end
end
