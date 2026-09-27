import { Heading, Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-24 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <Heading level="h1" className="headline text-5xl">
        Bag
      </Heading>
      <Text className="text-lg mt-4 mb-6 max-w-[32rem]">
        Your bag is empty. Pick a little monster and take it home.
      </Text>
      <InteractiveLink href="/store">Shop the monsters</InteractiveLink>
    </div>
  )
}

export default EmptyCartMessage
