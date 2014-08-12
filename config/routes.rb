PaceViz::Application.routes.draw do
  root to: 'charts#chord_two'

  # root to: 'sessions#new'
  # resources :sessions, only: [:new, :create, :destroy]
  # get 'chord_two' => 'charts#chord_two', as: "chords"
end
