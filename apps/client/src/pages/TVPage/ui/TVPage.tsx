import { IPTVPlayer } from '@/features/getTV';
import { Page } from '@/widgets/Layout';

export const TVPage = () => {
  const title = 'Телевидение';
  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: title }];

  return (
    <Page breadcrumbs={breadcrumbs} title={title}>
      <IPTVPlayer />
    </Page>
  );
};
