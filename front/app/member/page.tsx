import React from 'react'
import Client from './client'
import { redirect } from 'next/navigation';

const page =  async () => {
  return (
    <Client />
  )
}

export default page