import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { EventDetailPage } from './pages/EventDetailPage'
import { EventsProvider } from './events/EventsProvider'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { CategoryPage } from './pages/CategoryPage'
import { SiteLayout } from './components/SiteLayout'

export default function App() {
  return (
    <BrowserRouter>
      <EventsProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="kodomoto"
              element={
                <CategoryPage
                  key="kodomoto"
                  category="kodomoto"
                  eyebrow="親子で夢中になれる"
                  title="こどもと"
                  description="子どもだけでなく、親も一緒に楽しめる期間限定の体験を集めました。"
                />
              }
            />
            <Route
              path="family"
              element={
                <CategoryPage
                  key="family"
                  category="family_event"
                  eyebrow="今日は、少し特別に"
                  title="家族イベント"
                  description="誕生日や記念日など、家族でゆっくり過ごしたい日の候補です。"
                />
              }
            />
            <Route path="events/:eventId" element={<EventDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </EventsProvider>
    </BrowserRouter>
  )
}
