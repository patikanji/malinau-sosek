import React from 'react'
import Head from 'next/head'
import Header from  './Header'
import Footer from './Footer'

export default class Layout extends React.Component {
  componentDidMount () {
    // window.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.handleScroll, false);
  }

  render() {
    const title = this.props.config.title
    const back = this.props.config.back
    const next = this.props.config.next
    const footer = this.props.config.footer
    // const ribbon = this.props.config.ribbon
    // const name = this.props.config.user.name
    const isHome = this.props.config.isHome ? true : false
    const wrapperClass = footer ? 'wrapper' : 'wrapper-no-footer'

    return (
      <>
        <Head>
          <title>Sosek Mentarang - {title}</title>
        </Head>

        <Header title={title} user={this.props.config.user}/>

        <div className={wrapperClass}>

          <div className="max-w-5xl mx-auto text-gray-700 antialiased pb-16">

            {this.props.children}

          </div>

        </div>

        {footer && <Footer back={back} next={next} isHome={isHome} />}
      </>
    )
  }
}