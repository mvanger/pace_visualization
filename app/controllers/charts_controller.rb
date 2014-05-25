class ChartsController < ApplicationController
  def index
  end

  def chord_two
    if !current_user
      redirect_to root_url
    end
  end
end