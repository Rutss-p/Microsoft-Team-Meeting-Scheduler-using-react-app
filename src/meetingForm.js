import React, { useState } from 'react';

const MeetingForm = () => {
    // State to manage form input
    const [meetingName, setMeetingName] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Meeting Details:', {
            meetingName,
            startDateTime,
            endDateTime,
        });

        // Show alert with meeting details
        alert(`Meeting: ${meetingName}\nStart: ${startDateTime}\nEnd: ${endDateTime}`);

        // Reset form
        setMeetingName('');
        setStartDateTime('');
        setEndDateTime('');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Schedule a Meeting</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Meeting Name */}
                <div style={styles.formGroup}>
                    <label htmlFor="meetingName" style={styles.label}>Meeting Name:</label>
                    <input
                        type="text"
                        id="meetingName"
                        value={meetingName}
                        onChange={(e) => setMeetingName(e.target.value)}
                        required
                        style={styles.input}
                        placeholder="Enter meeting name"
                    />
                </div>

                {/* Start Date-Time */}
                <div style={styles.formGroup}>
                    <label htmlFor="startDateTime" style={styles.label}>Start Date and Time:</label>
                    <input
                        type="datetime-local"
                        id="startDateTime"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                {/* End Date-Time */}
                <div style={styles.formGroup}>
                    <label htmlFor="endDateTime" style={styles.label}>End Date and Time:</label>
                    <input
                        type="datetime-local"
                        id="endDateTime"
                        value={endDateTime}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <button type="submit" style={styles.submitButton}>Submit</button>
            </form>
        </div>
    );
};

// Inline CSS styles
const styles = {
    container: {
        display: 'flex',
        width: "50%",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    heading: {
        color: '#333',
        marginBottom: '20px',
    },
    form: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#333',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    submitButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default MeetingForm;
