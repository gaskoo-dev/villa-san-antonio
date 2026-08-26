import Image from 'next/image'

export function AdminLogo() {
  return (
    <span className="villa-admin-brand villa-admin-brand--full">
      <Image
        alt="Villa San Antonio"
        className="villa-admin-brand__mark"
        height={100}
        priority
        src="/branding/logo-black.png"
        width={100}
      />
      <span className="villa-admin-brand__copy">
        <strong>Villa San Antonio</strong>
        <span>CMS</span>
      </span>
    </span>
  )
}

export function AdminIcon() {
  return (
    <span className="villa-admin-brand villa-admin-brand--icon">
      <Image
        alt="Villa San Antonio"
        className="villa-admin-brand__mark"
        height={44}
        priority
        src="/branding/logo-black.png"
        width={44}
      />
    </span>
  )
}
