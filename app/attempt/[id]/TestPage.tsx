"use client"

import { notFound } from "next/navigation"

export default function TestPage({test}:{test:any}){
    return (
        <>
        <h1>This is Test Page</h1>
        <h2>{test.title}</h2>
        </>
    )
}