export type TErrorPageProps = {
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
};
