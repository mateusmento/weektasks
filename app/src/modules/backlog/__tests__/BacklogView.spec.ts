import { describe, it, beforeAll, afterAll, afterEach, expect } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import BacklogView from './BacklogView.vue';
import { render, fireEvent, cleanup } from '@testing-library/vue';

const server = setupServer();

describe('backlog view', () => {
  beforeAll(() => {
    server.listen();
    window.history.pushState({}, '', '/backlog');
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  const issues = [
    { id: 1, title: 'Issue 1' },
    { id: 2, title: 'Issue 2' },
  ];

  const ISSUE_URL = 'http://localhost:3000/issues';

  const getIssues = () => rest.get(ISSUE_URL, (req, res, ctx) => res(ctx.json(issues)));

  it('renders issues', async () => {
    server.use(getIssues());
    const screen = render(BacklogView);
    for (const issue of issues) {
      await screen.findByText(issue.title);
    }
  });

  const postIssues = (title: string) =>
    rest.post(ISSUE_URL, async (req, res, ctx) => res(ctx.json({ id: 1, title })));

  it('should create a new issue', async () => {
    const title = 'Issue 3';
    server.use(postIssues(title));
    const screen = render(BacklogView);
    let issueTitleInput: HTMLInputElement = screen.getByTestId('issue-title-input');
    const createIssueBtn = screen.getByTestId('create-issue-btn');
    fireEvent.update(issueTitleInput, title);
    fireEvent.click(createIssueBtn);
    issueTitleInput = (await screen.findByDisplayValue('')) as HTMLInputElement;
    expect(issueTitleInput.dataset.testid).toBe('issue-title-input');
    await screen.findByText(title);
  });
});
