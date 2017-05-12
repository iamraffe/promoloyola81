class UsersController < ApplicationController
  def index
    render json: {users: User.all}
  end

  def find
    render json: {users: User.find_by_full_name_or_nickname(params[:search_term])}
  end

  def user_params
    params.require(:user).permit(:avatar)
  end
end
