// src/components/NavBar.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <Navbar
      expand='lg'
      variant='dark'
      style={{
        backgroundColor: '#0d1b2a',
        height: '80px',
      }}
    >
      <Container>
        <Navbar.Brand as={NavLink} to='/' style={{ fontSize: '1.5rem', lineHeight: '80px' }}>
          NASA Explorer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='nav-links' />
        <Navbar.Collapse id='nav-links'>
          <Nav className='ms-auto'>
            {[
              { to: '/', label: 'APOD' },
              { to: '/rovers', label: 'Mars Rovers' },
              { to: '/epic', label: 'EPIC' },
              { to: '/neo', label: 'NeoWs' },
              { to: '/library', label: 'Library' },
            ].map(({ to, label }) => (
              <Nav.Link
                key={to}
                as={NavLink}
                to={to}
                end={to === '/'}
                style={{
                  fontSize: '1.25rem',
                  padding: '0.5rem 1rem',
                  lineHeight: '1.2',
                }}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
