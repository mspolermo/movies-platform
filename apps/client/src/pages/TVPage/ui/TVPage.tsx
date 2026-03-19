import { IPTVPlayer } from "@/features/getTV"
import { Layout } from "@/widgets/Layout"

export const TVPage = () => {
  return (
    <Layout title="Телевидение">
      <IPTVPlayer />
    </Layout>
  )
}