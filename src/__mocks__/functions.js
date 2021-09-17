import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'

export const renderWithRouter = (ui, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {Router})
}
