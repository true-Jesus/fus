package usecases

import "fus/repo"

type ProfileUseCase struct {
	repo *repo.Repo
}

func NewProUseCase(repo *repo.Repo) *ProfileUseCase {
	return &ProfileUseCase{repo: repo}
}

func (p *ProfileUseCase) SetProfileSettings(username, name, age, gender, zodiac, city, work, study, description string, interests []string) error {
	err := p.repo.SetProfileSettings(username, name, age, gender, zodiac, city, work, study, description, interests)
	if err != nil {
		return err
	}
	return nil
}
