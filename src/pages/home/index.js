import React from 'react';

// import About from '../../components/About/About';
// import PortfolioItem from '../../components/PortfolioItem/PortfolioItem';

// import ContactForm from '../../components/ContactForm/ContactForm';

// import works from '../../works';

class HomePage extends React.Component {
    state = {
        closed: true,
    };

    openForm() {
        this.setState({
            closed: false,
        });
    }

    closeForm() {
        this.setState({
            closed: true,
        });
    }

    render() {
        return (
            <div>
                
                {/* <div className='portfolio'>
                    <div className='container'>
                        {works.map((work) => (
                            <PortfolioItem key={work.id} work={work} />
                        ))}
                    </div>
                </div> */}
            </div>
        );
    }
}

export default HomePage;
