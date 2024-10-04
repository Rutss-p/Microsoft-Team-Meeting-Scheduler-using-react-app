import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import axios from "axios";

const TeamsMeetingScheduler = () => {
    const { instance, accounts } = useMsal();

    // State variables
    const [meetingDetails, setMeetingDetails] = useState({
        subject: "",
        startDateTime: "",
        endDateTime: "",
        attendees: "",
    });
    const [accessToken, setAccessToken] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Handle form change
    const handleChange = (e) => {
        setMeetingDetails({
            ...meetingDetails,
            [e.target.name]: e.target.value,
        });
    };

    // Get access token
    const getAccessToken = async () => {
        try {
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            });
            setAccessToken(response.accessToken);
            return response.accessToken;
        } catch (error) {
            console.warn("Silent token acquisition failed, acquiring via popup", error);
            try {
                const response = await instance.acquireTokenPopup(loginRequest);
                setAccessToken(response.accessToken);
                return response.accessToken;
            } catch (popupError) {
                console.error("Token acquisition via popup failed:", popupError);
                throw popupError;
            }
        }
    };

    // Schedule Meeting Function
    const scheduleMeeting = async () => {
        try {
            setError(""); // Clear previous errors

            const { subject, startDateTime, endDateTime, attendees } = meetingDetails;

            // Validate required fields
            if (!subject || !startDateTime || !endDateTime || !attendees) {
                setError("All fields are required.");
                return;
            }

            // Validate start and end times
            if (new Date(startDateTime) >= new Date(endDateTime)) {
                setError("End time must be after start time.");
                return;
            }

            // Convert to UTC
            const startUTC = new Date(startDateTime).toISOString();
            const endUTC = new Date(endDateTime).toISOString();

            // Prepare the attendees array
            const attendeesArray = attendees.split(',').map(email => {
                const trimmedEmail = email.trim();
                if (!validateEmail(trimmedEmail)) {
                    throw new Error(`Invalid email address: ${trimmedEmail}`);
                }
                return {
                    emailAddress: {
                        address: trimmedEmail,
                    },
                    type: "required",
                };
            });

            // Prepare the meeting details payload
            const payload = {
                subject: subject,
                start: {
                    dateTime: startUTC,
                    timeZone: "UTC",
                },
                end: {
                    dateTime: endUTC,
                    timeZone: "UTC",
                },
                isOnlineMeeting: true,
                onlineMeetingProvider: "teamsForBusiness",
                attendees: attendeesArray,
            };

            // Fetch access token
            const token = await getAccessToken();

            // Make API request to schedule the meeting
            setIsLoading(true);
            const response = await axios.post(
                'https://graph.microsoft.com/v1.0/me/events',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Handle success
            console.log("Meeting scheduled successfully:", response.data);
            alert("Meeting has been scheduled successfully!");
            // Optionally, reset the form
            setMeetingDetails({
                subject: "",
                startDateTime: "",
                endDateTime: "",
                attendees: "",
            });
        } catch (error) {
            // Handle error and display a user-friendly message
            console.error("Error scheduling meeting:", error.response?.data || error.message);
            setError("Failed to schedule the meeting. Please ensure all fields are correct and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Email validation function
    const validateEmail = (email) => {
        // Simple email regex for validation
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        scheduleMeeting();
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Schedule a Microsoft Teams Meeting</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
                {/* Meeting Subject */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Meeting Subject:</label>
                    <input
                        type="text"
                        name="subject"
                        value={meetingDetails.subject}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        placeholder="Enter meeting subject"
                    />
                </div>

                {/* Start DateTime */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Start Date and Time:</label>
                    <input
                        type="datetime-local"
                        name="startDateTime"
                        value={meetingDetails.startDateTime}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                {/* End DateTime */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>End Date and Time:</label>
                    <input
                        type="datetime-local"
                        name="endDateTime"
                        value={meetingDetails.endDateTime}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                {/* Attendees */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Attendees (comma-separated emails):</label>
                    <input
                        type="text"
                        name="attendees"
                        value={meetingDetails.attendees}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        placeholder="e.g., user1@example.com, user2@example.com"
                    />
                </div>

                {/* Error Message */}
                {error && <p style={styles.error}>{error}</p>}

                {/* Schedule Button */}
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
                </button>
            </form>
        </div>
    );
};

// Inline Styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    form: {
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#f7f7f7',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#0078d4',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
    },
};

export default TeamsMeetingScheduler;
