/* js/create_job.js */
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('create-job-form').addEventListener('submit', handleJobCreation);
});

function handleJobCreation(e) {
    e.preventDefault();

    const jobData = {
        id: Date.now(),
        title: document.getElementById('job-title').value,
        company: document.getElementById('company').value,
        location: document.getElementById('location').value,
        type: document.getElementById('job-type').value,
        salary: document.getElementById('salary').value,
        description: document.getElementById('description').value,
        requirements: document.getElementById('requirements').value,
        postedDate: new Date().toISOString(),
        authorId: JSON.parse(localStorage.getItem('user')).id
    };

    // Save to localStorage (simulating DB)
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    jobs.unshift(jobData); // Add to beginning
    localStorage.setItem('jobs', JSON.stringify(jobs));

    showToast('Oferta publicada con éxito', 'success');

    setTimeout(() => {
        window.location.href = 'communities.html?tab=jobs';
    }, 1500);
}
