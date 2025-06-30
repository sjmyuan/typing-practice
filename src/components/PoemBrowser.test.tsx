import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PoemBrowser from './PoemBrowser';
import * as tangPoemsUtils from '../utils/tangPoemsUtils';

// Mock the utils module
vi.mock('../utils/tangPoemsUtils');

const mockTangPoemsData = {
  name: "唐诗三百首",
  items: [
    {
      num: 1,
      author: "张九龄",
      title: "感遇四首之一",
      text: "孤鸿海上来，池潢不敢顾。\n侧见双翠鸟，巢在三珠树。"
    },
    {
      num: 2,
      author: "张九龄", 
      title: "感遇四首之二",
      text: "兰叶春葳蕤，桂华秋皎洁。\n欣欣此生意，自尔为佳节。"
    },
    {
      num: 3,
      author: "李白",
      title: "月下独酌",
      text: "花间一壶酒，独酌无相亲。\n举杯邀明月，对影成三人。"
    }
  ]
};

describe('PoemBrowser', () => {
  const mockOnStart = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(tangPoemsUtils.getTangPoemsFromCache).mockReturnValue(mockTangPoemsData);
    vi.mocked(tangPoemsUtils.loadTangPoems).mockResolvedValue(mockTangPoemsData);
    vi.mocked(tangPoemsUtils.cacheTangPoems).mockImplementation(() => {});
    vi.mocked(tangPoemsUtils.getAuthors).mockReturnValue(['张九龄', '李白']);
    vi.mocked(tangPoemsUtils.getTitlesByAuthor).mockImplementation((_data, author) => {
      if (author === '张九龄') return ['感遇四首之一', '感遇四首之二'];
      if (author === '李白') return ['月下独酌'];
      return [];
    });
    vi.mocked(tangPoemsUtils.getPoemByAuthorAndTitle).mockImplementation((_data, author, title) => {
      return mockTangPoemsData.items.find(item => item.author === author && item.title === title) || null;
    });
  });

  it('should render author selection by default when data is loaded from cache', async () => {
    render(<PoemBrowser onStart={mockOnStart} onBack={mockOnBack} />);
    
    await waitFor(() => {
      expect(screen.getByText('Select Author')).toBeInTheDocument();
      expect(screen.getByText('张九龄')).toBeInTheDocument();
      expect(screen.getByText('李白')).toBeInTheDocument();
    });
  });

  it('should load data from API when cache is empty', async () => {
    vi.mocked(tangPoemsUtils.getTangPoemsFromCache).mockReturnValue(null);
    
    render(<PoemBrowser onStart={mockOnStart} onBack={mockOnBack} />);
    
    await waitFor(() => {
      expect(tangPoemsUtils.loadTangPoems).toHaveBeenCalled();
      expect(tangPoemsUtils.cacheTangPoems).toHaveBeenCalledWith(mockTangPoemsData);
    });
  });

  it('should show loading state while fetching data', async () => {
    vi.mocked(tangPoemsUtils.getTangPoemsFromCache).mockReturnValue(null);
    vi.mocked(tangPoemsUtils.loadTangPoems).mockReturnValue(new Promise(() => {})); // Never resolves
    
    render(<PoemBrowser onStart={mockOnStart} onBack={mockOnBack} />);
    
    expect(screen.getByText('Loading poems...')).toBeInTheDocument();
  });

  it('should show error state when loading fails', async () => {
    vi.mocked(tangPoemsUtils.getTangPoemsFromCache).mockReturnValue(null);
    vi.mocked(tangPoemsUtils.loadTangPoems).mockRejectedValue(new Error('Network error'));
    
    render(<PoemBrowser onStart={mockOnStart} onBack={mockOnBack} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load poems. Please try again.')).toBeInTheDocument();
    });
  });

  it('should navigate to title selection when author is selected', async () => {
    render(<PoemBrowser onStart={mockOnStart} onBack={mockOnBack} />);
    
    await waitFor(() => {
      expect(screen.getByText('张九龄')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('张九龄'));
    
    await waitFor(() => {
      expect(screen.getByText('Select Title by 张九龄')).toBeInTheDocument();
      expect(screen.getByText('感遇四首之一')).toBeInTheDocument();
      expect(screen.getByText('感遇四首之二')).toBeInTheDocument();
    });
  });

  it('should navigate back to author selection from title selection', async () => {
    render(<PoemBrowser onStart={mockOnStart} onBack={mockOnBack} />);
    
    await waitFor(() => {
      expect(screen.getByText('张九龄')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('张九龄'));
    
    await waitFor(() => {
      expect(screen.getByText('← Back to Authors')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('← Back to Authors'));
    
    await waitFor(() => {
      expect(screen.getByText('Select Author')).toBeInTheDocument();
    });
  });

  it('should navigate to content preview when title is selected', async () => {
    render(<PoemBrowser onStart={mockOnStart} onBack={mockOnBack} />);
    
    await waitFor(() => {
      expect(screen.getByText('张九龄')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('张九龄'));
    
    await waitFor(() => {
      expect(screen.getByText('感遇四首之一')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('感遇四首之一'));
    
    await waitFor(() => {
      expect(screen.getByText('感遇四首之一')).toBeInTheDocument();
      expect(screen.getByText('by 张九龄')).toBeInTheDocument();
      expect(screen.getByText('Start Practice')).toBeInTheDocument();
    });
  });

  it('should call onStart with poem text when start practice is clicked', async () => {
    render(<PoemBrowser onStart={mockOnStart} onBack={mockOnBack} />);
    
    await waitFor(() => {
      expect(screen.getByText('张九龄')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('张九龄'));
    
    await waitFor(() => {
      expect(screen.getByText('感遇四首之一')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('感遇四首之一'));
    
    await waitFor(() => {
      expect(screen.getByText('Start Practice')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Start Practice'));
    
    expect(mockOnStart).toHaveBeenCalledWith("感遇四首之一\n张九龄\n孤鸿海上来，池潢不敢顾。\n侧见双翠鸟，巢在三珠树。");
  });

  it('should call onBack when back to options is clicked from author selection', async () => {
    render(<PoemBrowser onStart={mockOnStart} onBack={mockOnBack} />);
    
    await waitFor(() => {
      expect(screen.getByText('← Back to Options')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('← Back to Options'));
    
    expect(mockOnBack).toHaveBeenCalled();
  });
});
