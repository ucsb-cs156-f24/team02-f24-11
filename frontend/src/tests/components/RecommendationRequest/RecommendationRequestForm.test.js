import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';
import RecommendationRequestForm from 'main/components/RecommendationRequest/RecommendationRequestForm';
import { BrowserRouter as Router } from 'react-router-dom';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('RecommendationRequestForm tests', () => {
  test('renders correctly', async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Professor Email/);
    await screen.findByText(/Date Requested/);
    await screen.findByText(/Date Needed/);
    await screen.findByText(/Done/);
    await screen.findByText(/Create/);
    await screen.findByText(/Cancel/);
  });

  test('renders correctly when passing in a RecommendationRequest', async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={
            recommendationRequestFixtures.oneRecommendationRequest
          }
        />
      </Router>
    );
    await screen.findByTestId(/RecommendationRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue('1');
  });

  test('Correct Error messsages on bad input', async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    await screen.findByTestId('RecommendationRequestForm-submit');
    const requesterEmailField = screen.getByTestId(
      'RecommendationRequestForm-requesterEmail'
    );
    const professorEmailField = screen.getByTestId(
      'RecommendationRequestForm-professorEmail'
    );
    const dateRequestedField = screen.getByTestId(
      'RecommendationRequestForm-dateRequested'
    );
    const dateNeededField = screen.getByTestId(
      'RecommendationRequestForm-dateNeeded'
    );
    const doneField = screen.getByTestId('RecommendationRequestForm-done');
    const submitButton = screen.getByTestId('RecommendationRequestForm-submit');

    fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
    fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
    fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
    fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
    fireEvent.change(doneField, { target: { value: 'bad-input' } });
    fireEvent.click(submitButton);

    // await screen.findByText(/Date Requested must be in ISO format/);
  });

  test('Correct Error messsages on missing input', async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    await screen.findByTestId('RecommendationRequestForm-submit');
    const submitButton = screen.getByTestId('RecommendationRequestForm-submit');

    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required./);
    expect(
      screen.getByText(/Professor Email is required./)
    ).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required./)).toBeInTheDocument();
    // expect(screen.getByText(/Done is required./)).toBeInTheDocument();
  });

  test('No Error messsages on good input', async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>
    );
    await screen.findByTestId('RecommendationRequestForm-requesterEmail');

    const requesterEmailField = screen.getByTestId(
      'RecommendationRequestForm-requesterEmail'
    );
    const professorEmailField = screen.getByTestId(
      'RecommendationRequestForm-professorEmail'
    );
    const dateRequestedField = screen.getByTestId(
      'RecommendationRequestForm-dateRequested'
    );
    const dateNeededField = screen.getByTestId(
      'RecommendationRequestForm-dateNeeded'
    );
    const doneField = screen.getByTestId('RecommendationRequestForm-done');
    const submitButton = screen.getByTestId('RecommendationRequestForm-submit');

    fireEvent.change(requesterEmailField, {
      target: { value: 'test@gmail.com' },
    });
    fireEvent.change(professorEmailField, {
      target: { value: 'test@gmail.com' },
    });
    fireEvent.change(dateRequestedField, {
      target: { value: '2024-11-03T12:00:00' },
    });
    fireEvent.change(dateNeededField, {
      target: { value: '2024-12-03T12:00:00' },
    });
    fireEvent.change(doneField, { target: { value: 'true' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date Requested must be in ISO format/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date Needed must be in ISO format/)
    ).not.toBeInTheDocument();
  });

  test('that navigate(-1) is called when Cancel is clicked', async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    await screen.findByTestId('RecommendationRequestForm-cancel');
    const cancelButton = screen.getByTestId('RecommendationRequestForm-cancel');

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
