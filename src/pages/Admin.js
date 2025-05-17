import React from "react";
import { Link } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";

const Admin = () => {
  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <Card className="shadow-sm">
        <Card.Body className="text-center">
          <h2 className="text-primary mb-4">Admin Dashboard</h2>
          <p className="text-muted mb-4">Manage your song database and application settings</p>

          <div className="d-grid gap-3">
            <Link to="/admin/add-song">
              <Button variant="primary" size="lg" className="w-100 py-3">
                Add a New Song
              </Button>
            </Link>

            <Link to="/songs">
              <Button variant="outline-primary" size="lg" className="w-100 py-3">
                View All Songs
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Admin;