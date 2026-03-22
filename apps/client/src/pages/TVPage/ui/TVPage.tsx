import { IPTVPlayer } from '@/features/getTV';
import { Page } from '@/widgets/Layout';

export const TVPage = () => {
  return (
    <Page title="Телевидение">
      <IPTVPlayer />
    </Page>
  );
};
