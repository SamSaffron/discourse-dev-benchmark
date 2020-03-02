# frozen_string_literal: true

require 'rails_helper'

describe "Test helpers" do
  it "Reduces fidelity on all times" do

    times = [
      Time.new,
      Time.now
    ]

    freeze_time Time.now

    expect(Time.now).to eq(Time.new)

    times << Time.now

    db_times = DB.query_single(<<~SQL, *times)
      SELECT ?::timestamp without time zone
      UNION ALL
      SELECT ?
      UNION ALL
      SELECT ?
    SQL

    expect(db_times[0]).to eq(times[0])
    expect(db_times[1]).to eq(times[1])
    expect(db_times[2]).to eq(times[2])

  end
end
