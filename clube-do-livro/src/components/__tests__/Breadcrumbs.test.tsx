import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../ui/Breadcrumbs';

describe('Breadcrumbs', () => {
  const renderWithRouter = (initialRoute: string) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Breadcrumbs />
      </MemoryRouter>
    );
  };

  it('renders home breadcrumb for root path', () => {
    renderWithRouter('/');
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders admin breadcrumbs correctly', () => {
    renderWithRouter('/admin/courses');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Cursos')).toBeInTheDocument();
  });

  it('renders nested paths correctly', () => {
    renderWithRouter('/admin/students/123');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Alunas')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('applies correct styles to active breadcrumb', () => {
    renderWithRouter('/admin/courses');
    const lastBreadcrumb = screen.getByText('Cursos');
    expect(lastBreadcrumb).toHaveClass('text-gray-900', 'dark:text-white');
  });

  it('renders links for non-active breadcrumbs', () => {
    renderWithRouter('/admin/courses/new');
    const adminLink = screen.getByText('Admin').closest('a');
    expect(adminLink).toHaveAttribute('href', '/admin');
  });

  it('handles unknown segments with proper capitalization', () => {
    renderWithRouter('/admin/unknown-route');
    expect(screen.getByText('Unknown Route')).toBeInTheDocument();
  });

  it('handles numeric segments correctly', () => {
    renderWithRouter('/admin/courses/123/edit');
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });
});