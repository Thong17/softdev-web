import { ReactNode } from 'react'
import Container from 'components/shared/Container'
import { HintBox } from 'components/shared/HintBox'
import useStoreFeatures, { StoreFeature } from 'hooks/useStoreFeatures'

const names: Record<StoreFeature, string> = {
  labelPrinting: 'Label printing',
  tables: 'Tables & layout',
  reservation: 'Reservation',
  queue: 'Queue',
}

// Shows a page only while its feature is on (Organize › Store › Features), so
// an old link or bookmark explains itself instead of opening a hidden page
export const FeatureGuard = ({ feature, children }: { feature: StoreFeature, children: ReactNode }) => {
  const features = useStoreFeatures()
  if (features[feature]) return <>{children}</>
  return (
    <Container>
      <div style={{ paddingTop: 20 }}>
        <HintBox>
          {names[feature]} is turned off for this store. It can be turned on again in Organize › Store › Features.
        </HintBox>
      </div>
    </Container>
  )
}
