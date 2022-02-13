import Link from "next/link";
import { useEffect, useState } from "react";
import LogoLong from "./logo-long";

const Dashboard = ({ children }: { children: any}) => {
    const [domain, setDomain] = useState<string>()
    
    const share = () => {
        navigator.clipboard.writeText(domain ?? '#')
        alert('URL copied to your clipboard!')
    }

    useEffect(() => {
        if(location.hostname === 'localhost') return setDomain(`http://${window.location.host}`)
        setDomain(`https://${window.location.host}`)
    }, [])

    return (
        <div className='flex flex-row min-h-screen w-screen'>
                <div className='flex flex-col h-screen fixed top-0 left-0' style={{backgroundColor: '#1F2937', width: 350}}>
                    <div className='flex flex-col py-12 px-8'>
                        <div style={{width:170}} className='mb-12'><LogoLong/></div>
                        <ul className='p-0 m-0 space-y-3'>
                            <Link href='/dashboard/'>
                                <div className='cursor-pointer p-3 rounded-lg hover:bg-indigo-600 flex flex-row items-center justify-start'>
                                    <svg className="w-6 h-6" fill="rgba(255,255,255,.65)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path></svg>
                                    <span className='text-white text-lg ml-4'>Links</span>
                                </div>
                            </Link>
                            {/*
                            <Link href='/dashboard/analytics'>
                                <div className='cursor-pointer p-3 rounded-lg hover:bg-indigo-600 flex flex-row items-center justify-start'>
                                <svg className="w-6 h-6" fill="none" stroke="rgba(255,255,255,.65)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className='text-white text-lg ml-4'>Analytics</span>
                                </div>
                            </Link>
                            */}
                            {/*
                            <Link href='/dashboard/settings'>
                                <div className='cursor-pointer p-3 rounded-lg hover:bg-indigo-600 flex flex-row items-center justify-start'>
                                <svg className="w-6 h-6" fill="none" stroke="rgba(255,255,255,.65)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>                            <span className='text-white text-lg ml-4'>Settings</span>
                                </div>
                            </Link>
                            */}
                            <Link href='/logout'>
                                <div className='cursor-pointer p-3 rounded-lg hover:bg-indigo-600 flex flex-row items-center justify-start'>
                                <svg className="w-6 h-6" fill="none" stroke="rgba(255,255,255,.65)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>                            <span className='text-white text-lg ml-4'>Logout</span>
                                </div>
                            </Link>
                        </ul>
                    </div>
                    {/* TODO: Update link with Discount, and check if BRANDING is true before displaying */}
                    {/*<Link href="https://singlelink.co" passHref>
                        <a target="_blank" rel="noopener noreferrer" className='p-4 flex flex-col items-center justify-start mt-auto w-full text-white text-sm cursor-pointer hover:underline' style={{borderTop: 'solid 1px rgba(0,0,0,.15)', backgroundColor: 'rgba(0,0,0,.10)'}}>
                            🎁 Sign up for Singlelink Cloud and save 15%!
                        </a>
                    </Link>*/}
                </div>
                <div className="min-h-screen flex flex-col px-12 py-16" style={{width: 'calc(100% - 800px)', marginLeft: 350}}>
                    {children}
                </div>
                <div className='flex flex-col items-center justify-between h-screen fixed top-0 right-0 bg-white' style={{width: 450, borderLeft: 'solid 1px rgba(0,0,0,0.15)'}}>
                    <div className='flex flex-row items-center justify-between w-full px-4 py-6'  style={{borderBottom: 'solid 1px rgba(0,0,0,0.15)'}}>
                        <div className='flex flex-row items-center justify-start'>
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div>Page preview:</div>
                        </div>
                        <select>
                            <option>iPhone 12</option>
                        </select>
                    </div>
                    <div className='flex items-center justify-center' style={{width:375, height:812, transform: 'scale(.8)', borderRadius: 65, backgroundColor: '#000'}}>
                        <div style={{width:347, height: 767, borderRadius: 50, overflow: 'hidden'}}>
                            <iframe id="singlelink-preview" width={347} height={767} src={domain}></iframe>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center w-full text-center p-4' style={{borderTop: 'solid 1px rgba(0,0,0,.15)'}}>
                        Share your Singlelink:
                        <a href={domain} className='ml-2 mr-6 font-semibold text-indigo-600'>{domain}</a>
                        <svg onClick={() => share()} className="w-4 h-4 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    </div>
                </div>
            </div>
    )
}

export default Dashboard