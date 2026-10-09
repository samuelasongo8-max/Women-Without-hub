import { Navigate } from 'react-router-dom'

/**
 * /impact/news/ — News content moved to the Community Updates & Stories
 * page. A `replace` redirect keeps the URL clean and lets the browser
 * Back button return to wherever the user came from (no redirect loop).
 */
export default function News() {
  return <Navigate to="/updates/" replace />
}