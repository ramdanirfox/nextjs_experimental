import React, { useState } from 'react';
import { passwordStrength, defaultOptions, FirstOption, Option } from 'check-password-strength';
import escapeStringRegexp from 'escape-string-regexp';

// Define the type for custom feedback messages
interface FeedbackMessages {
    [id: number]: string;
}

export interface PasswordStrengthProps {
    /** INFO : this component relate with check-password-strengtb.*/
    Description?: void,
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
    // links = [],
    ...props
}: PasswordStrengthProps) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [strengthResult, setStrengthResult] = useState<any>(null);
    const [customOptionsResult, setCustomOptionsResult] = useState<any>({ contains: [] });
    const [restrictedSymbolsResult, setRestrictedSymbolsResult] = useState<any>(null);

    const customOptions: [FirstOption<any>, ...Option<any>[]] = [
        { id: 0, value: 'Very Weak', minDiversity: 0, minLength: 0 },
        { id: 1, value: 'Weak', minDiversity: 1, minLength: 2 },
        { id: 2, value: 'Okay', minDiversity: 3, minLength: 4 },
        { id: 3, value: 'Good', minDiversity: 4, minLength: 6 },
        { id: 4, value: 'Excellent', minDiversity: 4, minLength: 8 },
    ];

    const owaspSymbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
    const customFeedbackMessages: FeedbackMessages = {
        0: 'This password is too short and doesn\'t contain enough variety.',
        1: 'Try adding more character types (uppercase, numbers, symbols) or increasing the length.',
        2: 'Consider adding more symbols or increasing the length for better security.',
        3: 'A strong password! For even better security, consider a longer password.',
        4: 'Excellent password strength!',
    };

    const restrictedSymbols = "!@#";
    const restrictedFeedbackMessages: FeedbackMessages = {
        0: `This password is too short and doesn't contain enough variety using the allowed symbols (${restrictedSymbols}).`,
        1: `Try adding more character types (uppercase, lowercase, numbers) or increasing the length using the allowed symbols (${restrictedSymbols}).`,
        2: `Good start! You could still improve it by adding more characters or using more of the allowed symbols (${restrictedSymbols}).`,
        3: 'Strong password using the allowed symbols!',
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setStrengthResult(passwordStrength(newPassword));
        setCustomOptionsResult(passwordStrength(newPassword, customOptions));
        setRestrictedSymbolsResult(passwordStrength(newPassword, defaultOptions, restrictedSymbols)); // Restricting to only these symbols
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Password Strength Checker Demo</h2>

            <div>
                <h3>Basic Usage (Default Options)</h3>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={handlePasswordChange}
                    style={{ marginBottom: '10px', padding: '8px', width: '300px' }}
                />
                {strengthResult && strengthResult.id < 2 && (
                    <p style={{ color: 'orange' }}>Consider making your password longer and using a mix of uppercase letters, lowercase letters, numbers, and symbols.</p>
                )}
                {strengthResult && strengthResult.id === 2 && (
                    <p style={{ color: 'green' }}>Good start! You could still improve it by adding more characters or a symbol.</p>
                )}
                {strengthResult && strengthResult.id === 3 && (
                    <p style={{ color: 'green' }}>Strong password!</p>
                )}
                {strengthResult && (
                    <div style={{ marginTop: '10px' }}>
                        <strong>Strength:</strong> {strengthResult.value} ({strengthResult.id})<br />
                        <strong>Length:</strong> {strengthResult.length}<br />
                        <strong>Contains:</strong>
                        <ul>
                            {customOptionsResult.contains.map((item: any, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Custom Options with Separate Feedback</h3>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password (using custom options)"
                    value={password}
                    onChange={handlePasswordChange}
                    style={{ marginBottom: '10px', padding: '8px', width: '300px' }}
                />
                <button onClick={togglePasswordVisibility} style={{ marginLeft: '10px', padding: '8px' }}>
                    {showPassword ? 'Hide' : 'Show'}
                </button>
                {customOptionsResult && (
                    <div style={{ marginTop: '10px' }}>
                        {customFeedbackMessages[customOptionsResult.id] && (
                            <p style={{ color: customOptionsResult.id < 3 ? 'orange' : 'green' }}>
                                {customFeedbackMessages[customOptionsResult.id]}
                            </p>
                        )}
                        <strong>Strength (Custom):</strong> {customOptionsResult.value} ({customOptionsResult.id})<br />
                        <strong>Length:</strong> {customOptionsResult.length}<br />
                        <strong>Contains:</strong>
                        <ul>
                            {customOptionsResult.contains.map((item: any, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <p>Custom Options Used:</p>
                <pre>{JSON.stringify(customOptions, null, 2)}</pre>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Restricting Symbols with Separate Feedback</h3>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password (restricted symbols: !@#)"
                    value={password}
                    onChange={handlePasswordChange}
                    style={{ marginBottom: '10px', padding: '8px', width: '300px' }}
                />
                {restrictedSymbolsResult && (
                    <div style={{ marginTop: '10px' }}>
                        <strong>Strength (Restricted Symbols):</strong> {restrictedSymbolsResult.value} ({restrictedSymbolsResult.id})<br />
                        <strong>Length:</strong> {restrictedSymbolsResult.length}<br />
                        <strong>Contains:</strong>
                        {restrictedSymbolsResult.contains.lowercase && ' lowercase '}
                        {restrictedSymbolsResult.contains.uppercase && ' uppercase '}
                        {restrictedSymbolsResult.contains.number && ' number '}
                        {restrictedSymbolsResult.contains.symbol && ' symbol '}
                        {restrictedFeedbackMessages[restrictedSymbolsResult.id] && (
                            <p style={{ color: restrictedSymbolsResult.id < 2 ? 'orange' : 'green' }}>
                                {restrictedFeedbackMessages[restrictedSymbolsResult.id]}
                            </p>
                        )}
                    </div>
                )}
                <p>Symbols Restricted To: `{restrictedSymbols}`</p>
            </div>
        </div>
    );
}