import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "@/pages/HomePage";
import QuizPage from "@/pages/QuizPage";
import ResultsPage from "@/pages/ResultsPage";
import ReviewPage from "@/pages/ReviewPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/quiz/:topicId/:mode" component={QuizPage} />
      <Route path="/quiz/:topicId" component={QuizPage} />
      <Route path="/results" component={ResultsPage} />
      <Route path="/review" component={ReviewPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}
