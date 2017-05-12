require 'test_helper'

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get app" do
    get pages_app_url
    assert_response :success
  end

  test "should get dashboard" do
    get pages_dashboard_url
    assert_response :success
  end

end
