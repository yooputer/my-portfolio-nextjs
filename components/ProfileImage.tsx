'use client';
import Image from 'next/image';

export function ProfileImage() {
  return (
    <Image
      src={'/images/profile.JPG'}
      alt="프로필이미지"
      width={144}
      height={144}
      className="object-cover"
    />
  );
}
