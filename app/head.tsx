import DefaultHead from '#/components/defaultHead'
import constants from '#/constants'

export default function Head() {
  return (
    <>
      <DefaultHead description={constants.siteDescription} />
    </>
  )
}
