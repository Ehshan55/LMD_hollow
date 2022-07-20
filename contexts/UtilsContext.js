import Router from 'next/router'

export function RedirectPage(ctx, redirectTo) {
    typeof window !== 'undefined' ? Router.push('/') : ctx.res.writeHead(302, { Location: redirectTo }).end()
}