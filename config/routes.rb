PaceViz::Application.routes.draw do
  root to: 'charts#index'
  get 'chord_two' => 'charts#chord_two'
end
