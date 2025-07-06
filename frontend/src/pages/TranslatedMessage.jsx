// src/components/TranslatedMessage.jsx
import React, { useState, useEffect } from 'react';
import { MessageSimple, useMessageContext } from 'stream-chat-react'; // Import useMessageContext
import { translateText } from '../lib/translateApi.js'; // Import the utility function

const TranslatedMessage = (props) => {
    // Correctly get the message object using useMessageContext()
    // This is how Stream Chat components typically access the message data
    const { message } = useMessageContext();

    // Now, your custom props (preferredLang, authUserId) are passed directly to TranslatedMessage
    const { preferredLang, authUserId } = props;

    //console.log("TranslatedMessage raw props:", props); // Check all props passed to TranslatedMessage
    //console.log("TranslatedMessage message from context:", message); // Check message from context

    // Initialize displayedText with optional chaining because message might be null initially
    const [displayedText, setDisplayedText] = useState(message?.text);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationError, setTranslationError] = useState(null);

    useEffect(() => {
        const fetchTranslation = async () => {
            // Ensure message and its text property exist before trying to translate
            if (!message?.text) {
                setDisplayedText(""); // Or handle as per your UI needs for non-text messages
                setIsTranslating(false);
                setTranslationError(null);
                return;
            }

            // Only translate if:
            // 1. The message has text.
            // 2. The preferred language is not the default English.
            // 3. The message is NOT sent by the current user (if you want to exclude your own messages from being translated on your screen).
            //    If you want your own messages translated, remove `message.user?.id === authUserId`.
            const shouldTranslate = (
                preferredLang !== 'en' &&
                message.user?.id !== authUserId // Use optional chaining for message.user.id
            );

            if (shouldTranslate) {
                setIsTranslating(true);
                setTranslationError(null);
                try {
                    const translated = await translateText(message.text, preferredLang);
                    console.log("Translation result:", translated); // Log the translation result
                    setDisplayedText(translated);
                } catch (error) {
                    setTranslationError("Translation failed.");
                    setDisplayedText(message.text); // Fallback to original text
                } finally {
                    setIsTranslating(false);
                }
            } else {
                // If no translation needed, display original text
                setDisplayedText(message.text);
                setIsTranslating(false);
                setTranslationError(null);
            }
        };

        // Dependencies: message.text (for content), preferredLang (for target), message.user?.id and authUserId (for sender check)
        // Add message?.user?.id and authUserId to dependencies to re-run if sender changes or auth user changes
        fetchTranslation();
    }, [message?.text, preferredLang, message?.user?.id, authUserId]);


    // Pass all original props to MessageSimple, but override the message.text with displayedText
    return (
        <div style={{ position: 'relative' }}>
            {/* Pass message object with potentially translated text to MessageSimple */}
            <MessageSimple {...props} message={{ ...message, text: displayedText }} />
            {isTranslating && (
                <span style={{ fontSize: '0.75em', color: '#888', position: 'absolute', bottom: 5, right: 10 }}>
                    Translating...
                </span>
            )}
            {translationError && (
                <span style={{ fontSize: '0.75em', color: 'red', position: 'absolute', bottom: 5, right: 10 }}>
                    {translationError}
                </span>
            )}
            {/* Optional: Show original text when translated */}
            {message?.text !== displayedText && !isTranslating && !translationError && (
                <span style={{ fontSize: '0.75em', color: '#666', marginTop: '5px', display: 'block', paddingLeft: '5px' }}>
                    (Original: {message.text})
                </span>
            )}
        </div>
    );
};

export default TranslatedMessage;