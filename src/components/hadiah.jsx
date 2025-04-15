import { useState, useEffect, useRef } from 'react';
import { Terminal, Gift, XCircle, Music } from 'lucide-react';

export default function TerminalRomanticGift() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Najmita Zahira Dirgantoro Terminal [Version 2.0.0]' },
    { type: 'system', content: '(c) 2025 Love Corporation. All rights reserved.' },
    { type: 'system', content: '' },
    { type: 'system', content: 'Ketik "help" untuk melihat daftar perintah yang tersedia.' },
    { type: 'system', content: '' },
    { type: 'prompt', content: 'C:\\Users\\Najmita>' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [isBarcodeVisible, setIsBarcodeVisible] = useState(false);
  const [typingLyric, setTypingLyric] = useState({ text: '', index: 0 });
  const [songLyrics, setSongLyrics] = useState([]);
  
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);
  const typingTimerRef = useRef(null);
  
  // ASCII art banner
  const banner = [
    " ███╗   ██╗ █████╗      ██╗███╗   ███╗██╗████████╗ █████╗ ",
    " ████╗  ██║██╔══██╗     ██║████╗ ████║██║╚══██╔══╝██╔══██╗",
    " ██╔██╗ ██║███████║     ██║██╔████╔██║██║   ██║   ███████║",
    " ██║╚██╗██║██╔══██║██   ██║██║╚██╔╝██║██║   ██║   ██╔══██║",
    " ██║ ╚████║██║  ██║╚█████╔╝██║ ╚═╝ ██║██║   ██║   ██║  ██║",
    " ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚════╝ ╚═╝     ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝",
    " ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️",
    "                    For Najmita Zahira                    ",
    "                   With All My Love 💖                   "
  ]
  
  // Math formulas for decoration
  const mathFormulas = [
    "∫(Love) dt = Forever",
    "√(You + Me) = Happiness",
    "lim[x→∞] Our Love = ∞",
    "f(x) = Love × e^x where x = days together"
  ];

  // Fungsi untuk parse file LRC sederhana (hanya lirik)
  const parseLRC = (lrcText) => {
    const lines = lrcText.split('\n');
    const lyrics = [];
    
    lines.forEach(line => {
      // Parse lirik dengan timestamp
      const timeTagMatch = line.match(/^\[(\d+):(\d+\.\d+)\](.*)$/);
      if (timeTagMatch) {
        const minutes = parseInt(timeTagMatch[1], 10);
        const seconds = parseFloat(timeTagMatch[2]);
        const text = timeTagMatch[3].trim();
        
        if (text) {
          const time = minutes * 60 + seconds;
          lyrics.push({ text, time });
        }
      }
    });
    
    return lyrics;
  };

  // Fungsi untuk load file LRC
  const loadLRC = async (lrcPath, audioPath = null) => {
    try {
      const response = await fetch(lrcPath);
      if (!response.ok) throw new Error('Gagal memuat file LRC');
      
      const lrcText = await response.text();
      const lyrics = parseLRC(lrcText);
      
      setSongLyrics(lyrics);
      
      // Set audio path jika disediakan
      if (audioPath && audioRef.current) {
        audioRef.current.src = audioPath;
      }
      
      return true;
    } catch (error) {
      console.error('Error loading LRC file:', error);
      setHistory(prev => [
        ...prev,
        { type: 'system', content: `Error: Gagal memuat lirik - ${error.message}` },
        { type: 'prompt', content: 'C:\\Users\\Najmita>' }
      ]);
      return false;
    }
  };

  const commands = {
    help: () => {
      return [
        'Perintah yang tersedia:',
        '  help     - Menampilkan daftar perintah',
        '  clear    - Membersihkan layar terminal',
        '  banner   - Menampilkan banner cinta',
        '  math     - Menampilkan rumus cinta',
        '  message  - Menampilkan pesan cinta',
        '  hadiah   - Menampilkan hadiah spesial untukmu',
        '  play     - Memutar lagu cinta',
        '  ctrl+c   - Membatalkan operasi saat ini',
        ''
      ];
    },
    clear: () => {
      setHistory([
        { type: 'system', content: 'Najmita Zahira Dirgantoro Terminal [Version 2.0.0]' },
        { type: 'system', content: '(c) 2025 Love Corporation. All rights reserved.' },
        { type: 'system', content: '' },
        { type: 'prompt', content: 'C:\\Users\\Najmita>' }
      ]);
      return [];
    },
    banner: () => {
      return [...banner, ''];
    },
    math: () => {
      return [
        'Rumus Cinta:',
        ...mathFormulas,
        ''
      ];
    },
    message: () => {
      return [
        '---------------------------------------------',
        'Hai Najmita Zahira Dirgantoro yang ku sayang,',
        '',
        'Aku membuat ini spesial untukmu. Aku ingin',
        'kamu tahu betapa aku mencintaimu dan betapa',
        'berharganya kamu di hidupku.',
        '',
        'Coba ketik "play" untuk mendengarkan',
        'lagu yang aku dedikasikan untukmu.',
        'Atau ketik "hadiah" untuk sesuatu yang spesial.',
        '',
        'Love you always and forever.',
        '---------------------------------------------',
        ''
      ];
    },
    hadiah: () => {
      setIsBarcodeVisible(true);
      return [
        '🎁 Aku punya sesuatu untukmu! 🎁',
        '',
        'Klik barcode ini untuk mengklaim hadiah spesialmu:',
        '',
        '[Barcode loading...]',
        ''
      ];
    },
    play: async () => {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        clearTimeout(typingTimerRef.current);
        return [
          'Pemutaran lagu dihentikan.',
          ''
        ];
      }
      
      // Load lagu dan lirik
      const success = await loadLRC('/lyrics/sempurna.lrc', '/music/sempurna.mp3');
      if (!success) return [];
      
      setIsPlaying(true);
      setCurrentLyricIndex(0);
      
      const typingOutput = [];
      
      // Add initial output
      typingOutput.push('> music-player@1.0.0 play');
      typingOutput.push('> playing song...');
      typingOutput.push('');
      typingOutput.push('🎵 Now playing: Lagu Cinta 🎵');
      typingOutput.push('═══════════════════════════════════════');
      typingOutput.push('');
      
      // Display the initial message
      setHistory(prev => [
        ...prev,
        ...typingOutput.map(line => ({ type: 'system', content: line }))
      ]);
      
      // Start playing audio
      if (!audioRef.current) {
        audioRef.current = new Audio('/music/sempurna.mp3');
      }
      
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setHistory(prev => [
          ...prev,
          { type: 'system', content: `Error: Gagal memutar lagu - ${error.message}` },
          { type: 'prompt', content: 'C:\\Users\\Najmita>' }
        ]);
        setIsPlaying(false);
      });
      
      return [];
    },
    'npm run start': async () => {
      return await commands.play();
    }
  };

  // Handle song lyrics synchronization
  useEffect(() => {
    if (!isPlaying || !audioRef.current || songLyrics.length === 0) return;

    const audio = audioRef.current;
    
    // Function to update current lyric based on audio time
    const updateLyric = () => {
      const currentTime = audio.currentTime;
      
      // Find the appropriate lyric for the current time
      let foundIndex = -1;
      for (let i = 0; i < songLyrics.length; i++) {
        if (currentTime >= songLyrics[i].time) {
          foundIndex = i;
        } else {
          break;
        }
      }
      
      if (foundIndex !== -1 && foundIndex !== currentLyricIndex) {
        setCurrentLyricIndex(foundIndex);
        
        // Start typing animation for this lyric
        setTypingLyric({ text: songLyrics[foundIndex].text, index: 0 });
        
        // Add an empty placeholder for this lyric
        setHistory(prev => [...prev, { type: 'lyrics', content: '', id: `lyric-${foundIndex}` }]);
      }
    };

    // Update lyrics every 100ms
    const intervalId = setInterval(updateLyric, 100);

    // Handle song end
    const onEnded = () => {
      setIsPlaying(false);
      clearTimeout(typingTimerRef.current);
      clearInterval(intervalId);
      setHistory(prev => [
        ...prev,
        { type: 'system', content: '' },
        { type: 'system', content: '❤️ Aku akan selalu mencintaimu, Najmita ❤️' },
        { type: 'system', content: '' },
        { type: 'prompt', content: 'C:\\Users\\Najmita>' }
      ]);
    };

    audio.addEventListener('ended', onEnded);

    return () => {
      clearInterval(intervalId);
      clearTimeout(typingTimerRef.current);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isPlaying, songLyrics, currentLyricIndex]);

  // Character-by-character typing effect for lyrics
  useEffect(() => {
    if (!typingLyric.text || typingLyric.index > typingLyric.text.length) return;
    
    // Calculate typing speed based on lyric length
    const typingInterval = 80; // milliseconds between typing each character
    
    // Type the next character
    typingTimerRef.current = setTimeout(() => {
      // Find the current lyric entry in history and update it
      setHistory(prev => {
        const newHistory = [...prev];
        const lyricIndex = prev.findIndex(
          item => item.type === 'lyrics' && 
          item.id === `lyric-${currentLyricIndex}`
        );
        
        if (lyricIndex !== -1) {
          newHistory[lyricIndex] = {
            ...newHistory[lyricIndex],
            content: typingLyric.text.substring(0, typingLyric.index + 1)
          };
        }
        
        return newHistory;
      });
      
      // Move to next character
      setTypingLyric(prev => ({
        ...prev,
        index: prev.index + 1
      }));
    }, typingInterval);
    
    return () => clearTimeout(typingTimerRef.current);
  }, [typingLyric, currentLyricIndex]);

  // Auto-scroll to bottom when terminal content updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, isTyping, typingLyric]);

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleTerminalClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const terminalElement = terminalRef.current;
    if (terminalElement) {
      terminalElement.addEventListener('click', handleTerminalClick);
    }

    return () => {
      if (terminalElement) {
        terminalElement.removeEventListener('click', handleTerminalClick);
      }
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+C handling
      if (e.ctrlKey && e.key === 'c') {
        if (isTyping || isPlaying) {
          e.preventDefault();
          handleCtrlC();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTyping, isPlaying]);

  const handleCtrlC = () => {
    if (isTyping || isPlaying) {
      setIsTyping(false);
      setIsPlaying(false);
      setCurrentCommand('');
      clearTimeout(typingTimerRef.current);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Add ^C to history
      setHistory(prev => [
        ...prev,
        { type: 'system', content: '^C' },
        { type: 'system', content: 'Operation canceled by user.' },
        { type: 'prompt', content: 'C:\\Users\\Najmita>' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && !isTyping) {
      e.preventDefault();
      
      const trimmedInput = input.trim();
      
      // Add command to history
      setHistory(prev => [...prev, { type: 'command', content: trimmedInput }]);
      setInput('');
      
      // Process command
      const command = trimmedInput.toLowerCase();
      
      if (commands[command]) {
        const output = await commands[command]();
        if (output && output.length > 0) {
          setHistory(prev => [
            ...prev,
            ...output.map(line => ({ type: 'system', content: line })),
            { type: 'prompt', content: 'C:\\Users\\Najmita>' }
          ]);
        }
      } else if (trimmedInput !== '') {
        setHistory(prev => [
          ...prev,
          { type: 'system', content: `'${trimmedInput}' tidak dikenali sebagai perintah internal atau eksternal.` },
          { type: 'system', content: '' },
          { type: 'prompt', content: 'C:\\Users\\Najmita>' }
        ]);
      } else {
        setHistory(prev => [...prev, { type: 'prompt', content: 'C:\\Users\\Najmita>' }]);
      }
    }
  };

  const closeBarcode = () => {
    setIsBarcodeVisible(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-green-400 font-mono">
      {/* Math formulas decoration */}
      <div className="fixed top-0 right-0 p-4 text-xs sm:text-sm opacity-40 text-right hidden md:block">
        {mathFormulas.map((formula, index) => (
          <div key={index} className="mb-2">{formula}</div>
        ))}
      </div>
      
      {/* Terminal */}
      <div className="flex-1 flex flex-col p-2 sm:p-4 md:p-8 max-w-4xl mx-auto w-full h-full">
        <div className="bg-black border-2 border-green-500 rounded-lg overflow-hidden flex flex-col h-full">
          {/* Terminal header */}
          <div className="bg-green-900 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <Terminal className="w-4 h-4 mr-2" />
              <div className="font-semibold text-sm sm:text-base">Najmita's Terminal</div>
            </div>
            {isPlaying && (
              <div className="flex items-center text-xs">
                <Music className="w-4 h-4 mr-1 animate-pulse" />
                <span>Now Playing</span>
              </div>
            )}
            {(isTyping || isPlaying) && (
              <button 
                onClick={handleCtrlC}
                className="text-xs bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded flex items-center"
              >
                <XCircle className="w-3 h-3 mr-1" /> Ctrl+C
              </button>
            )}
          </div>
          
          {/* Terminal content */}
          <div 
            ref={terminalRef}
            className="flex-1 p-2 sm:p-4 overflow-y-auto bg-black terminal-content"
            style={{ 
              fontFamily: "'Courier New', monospace",
              maxHeight: "75vh"
            }}
          >
            {history.map((entry, index) => (
              <div key={index} className="whitespace-pre-wrap mb-1">
                {entry.type === 'prompt' ? (
                  <div className="flex">
                    <div className="text-blue-400">{entry.content}</div>
                    {index === history.length - 1 && !isTyping ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none text-green-300 ml-1 caret-green-500"
                        autoFocus
                      />
                    ) : null}
                  </div>
                ) : entry.type === 'command' ? (
                  <div className="text-green-300">{entry.content}</div>
                ) : entry.type === 'lyrics' ? (
                  <div className="text-purple-400 font-bold">
                    {entry.content}
                    {entry.content && entry.id === `lyric-${currentLyricIndex}` && 
                     entry.content.length < typingLyric.text.length && (
                      <span className="animate-pulse">▌</span>
                    )}
                  </div>
                ) : (
                  <div className="text-green-400">{entry.content}</div>
                )}
              </div>
            ))}
            
            {/* Typing animation */}
            {isTyping && (
              <div className="text-pink-400 font-bold"> 
                {currentCommand}<span className="animate-pulse">▌</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="text-center text-green-700 text-sm py-2 sm:py-4">
        Made with ❤️ for Najmita Zahira Dirgantoro
      </footer>
      
      {/* Barcode Modal */}
      {isBarcodeVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-4 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-green-400">
                <Gift className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-bold">Hadiah Spesial</h3>
              </div>
              <button 
                onClick={closeBarcode}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-green-300 mb-4">Klik barcode ini untuk mengklaim hadiahmu:</p>
              
              <a 
                href="https://drive.google.com/drive/folders/your-folder-id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block mx-auto hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/public/ticket-barcode.png" 
                  alt="Barcode Tiket" 
                  className="mx-auto max-w-full h-auto cursor-pointer"
                  style={{ maxHeight: "200px" }}
                />
              </a>
              
              <p className="text-green-400 mt-4 text-sm">Klik barcode untuk membuka hadiah spesialmu di Google Drive.</p>
            </div>
          </div>    
        </div>
      )}
      
      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}