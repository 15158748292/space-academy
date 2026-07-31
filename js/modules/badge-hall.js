/**
 * BadgeModule - 勋章墙
 */

const BadgeModule = {
    renderBadgeWall(container) {
        const earnedBadges = Store.data.badges;
        let badgesHtml = '';

        for (const [id, badge] of Object.entries(BADGES)) {
            const earned = earnedBadges.includes(id);
            badgesHtml += `
                <div class="badge-item ${earned ? 'earned' : ''}">
                    <div class="badge-item-icon">${badge.icon}</div>
                    <div class="badge-item-name">${badge.name}</div>
                    <div class="badge-item-desc">${badge.desc}</div>
                </div>
            `;
        }

        container.innerHTML = `
            <div style="text-align:center;margin-bottom:20px;">
                <h2 style="font-family:var(--font-title);font-size:2rem;color:var(--color-star-yellow);">勋章墙</h2>
                <p style="color:var(--color-text-secondary);">已获得 ${earnedBadges.length} / ${Object.keys(BADGES).length} 枚勋章</p>
            </div>
            <div class="badge-wall">
                ${badgesHtml}
            </div>
        `;
    }
};

window.BadgeModule = BadgeModule;
